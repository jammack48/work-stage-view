import { supabase } from "@/integrations/supabase/client";
import { getTable } from "@/lib/modeTable";

type ContactType = "email" | "phone";
type AddressType = "site" | "postal" | "other";

type ContactRecord = {
  type: ContactType;
  value: string;
  label: string;
  isPrimary: boolean;
};

type AddressRecord = {
  type: AddressType;
  line1: string;
  line2?: string;
  suburb?: string;
  city?: string;
  postcode?: string;
  country?: string;
  isPrimary: boolean;
};

type CsvRow = Record<string, string>;

const EMAIL_COLUMNS = ["SAEmail1", "SAEmail2", "POEmail1"];
const PHONE_COLUMNS = ["SAMobilePhone1", "SAPhone1", "SAPhone2", "POPhone1", "POMobilePhone1"];

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      row.push(current);
      current = "";
      if (row.some((cell) => cell.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    if (row.some((cell) => cell.trim().length > 0)) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const mapped: CsvRow = {};
    headers.forEach((header, index) => {
      mapped[header] = (values[index] ?? "").trim();
    });
    return mapped;
  });
}

const normalizeValue = (value: string): string => value.trim();
const normalizeEmail = (value: string): string => value.trim().toLowerCase();
const normalizePhone = (value: string): string => value.replace(/\s+/g, "").trim();
const normalizeAddressKey = (address: AddressRecord): string =>
  [address.type, address.line1, address.line2 ?? "", address.suburb ?? "", address.city ?? "", address.postcode ?? "", address.country ?? ""]
    .map((part) => part.trim().toLowerCase())
    .join("|");

function readFirstNonEmpty(row: CsvRow, keys: string[]): string | null {
  for (const key of keys) {
    const value = normalizeValue(row[key] ?? "");
    if (value) {
      return value;
    }
  }
  return null;
}

function deriveContacts(row: CsvRow): ContactRecord[] {
  const contacts: ContactRecord[] = [];
  const emailSet = new Set<string>();
  const phoneSet = new Set<string>();

  EMAIL_COLUMNS.forEach((column, index) => {
    const raw = normalizeValue(row[column] ?? "");
    if (!raw) return;
    const dedupeKey = normalizeEmail(raw);
    if (emailSet.has(dedupeKey)) return;
    emailSet.add(dedupeKey);
    contacts.push({
      type: "email",
      value: raw,
      label: index === 0 ? "primary" : "secondary",
      isPrimary: index === 0,
    });
  });

  PHONE_COLUMNS.forEach((column) => {
    const raw = normalizeValue(row[column] ?? "");
    if (!raw) return;
    const dedupeKey = normalizePhone(raw);
    if (phoneSet.has(dedupeKey)) return;
    phoneSet.add(dedupeKey);
    const isPrimary = column === "SAMobilePhone1";
    contacts.push({
      type: "phone",
      value: raw,
      label: isPrimary ? "primary" : "secondary",
      isPrimary,
    });
  });

  const firstEmail = contacts.find((contact) => contact.type === "email");
  if (firstEmail && !contacts.some((contact) => contact.type === "email" && contact.isPrimary)) {
    firstEmail.isPrimary = true;
    firstEmail.label = "primary";
  }

  const firstPhone = contacts.find((contact) => contact.type === "phone");
  if (firstPhone && !contacts.some((contact) => contact.type === "phone" && contact.isPrimary)) {
    firstPhone.isPrimary = true;
    firstPhone.label = "primary";
  }

  return contacts;
}

function deriveAddresses(row: CsvRow): AddressRecord[] {
  const siteLine1 = normalizeValue(row.SAAddress ?? "");
  const postalLine1 = normalizeValue(row.POAddress ?? "");
  const addresses: AddressRecord[] = [];
  const dedupe = new Set<string>();

  if (siteLine1) {
    const siteAddress: AddressRecord = {
      type: "site",
      line1: siteLine1,
      suburb: normalizeValue(row.SASuburb ?? "") || undefined,
      city: normalizeValue(row.SACity ?? "") || undefined,
      postcode: normalizeValue(row.SAPostCode ?? row.SAPostcode ?? "") || undefined,
      country: normalizeValue(row.SACountry ?? "") || undefined,
      isPrimary: true,
    };
    dedupe.add(normalizeAddressKey(siteAddress));
    addresses.push(siteAddress);
  }

  if (postalLine1) {
    const postalAddress: AddressRecord = {
      type: "postal",
      line1: postalLine1,
      suburb: normalizeValue(row.POSuburb ?? "") || undefined,
      city: normalizeValue(row.POCity ?? "") || undefined,
      postcode: normalizeValue(row.POPostCode ?? row.POPostcode ?? "") || undefined,
      country: normalizeValue(row.POCountry ?? "") || undefined,
      isPrimary: false,
    };
    const key = normalizeAddressKey(postalAddress);
    if (!dedupe.has(key)) {
      dedupe.add(key);
      addresses.push(postalAddress);
    }
  }

  if (addresses.length > 0 && !addresses.some((address) => address.isPrimary)) {
    addresses[0].isPrimary = true;
  }

  return addresses;
}

export async function importCustomersCsv(file: File): Promise<{ imported: number }> {
  const text = await file.text();
  const rows = parseCsv(text);

  let imported = 0;

  const customersTable = getTable("customers", false);
  const customerContactsTable = getTable("customer_contacts", false);
  const customerAddressesTable = getTable("customer_addresses", false);

  for (const row of rows) {
    const name = readFirstNonEmpty(row, ["CustomerName", "ClientName", "Name"]);
    if (!name) continue;

    const contacts = deriveContacts(row);
    const addresses = deriveAddresses(row);

    const primaryEmail = contacts.find((contact) => contact.type === "email" && contact.isPrimary)?.value
      ?? contacts.find((contact) => contact.type === "email")?.value
      ?? null;
    const primaryPhone = contacts.find((contact) => contact.type === "phone" && contact.isPrimary)?.value
      ?? contacts.find((contact) => contact.type === "phone")?.value
      ?? null;
    const primaryAddress = addresses.find((address) => address.isPrimary) ?? addresses[0];

    const { data: insertedCustomer, error: customerError } = await (supabase as any)
      .from(customersTable)
      .insert({
        name,
        source: "fergus_csv",
        primary_email: primaryEmail,
        primary_phone: primaryPhone,
        primary_address_line_1: primaryAddress?.line1 ?? null,
        primary_suburb: primaryAddress?.suburb ?? null,
        primary_city: primaryAddress?.city ?? null,
        primary_postcode: primaryAddress?.postcode ?? null,
        primary_country: primaryAddress?.country ?? null,
      })
      .select("id")
      .single();

    if (customerError || !insertedCustomer?.id) {
      throw customerError ?? new Error("Failed to create customer during CSV import.");
    }

    const customerId = insertedCustomer.id as string;

    if (contacts.length > 0) {
      const { error: contactsError } = await (supabase as any)
        .from(customerContactsTable)
        .insert(
          contacts.map((contact) => ({
            customer_id: customerId,
            type: contact.type,
            value: contact.value,
            label: contact.label,
            is_primary: contact.isPrimary,
          }))
        );
      if (contactsError) throw contactsError;
    }

    if (addresses.length > 0) {
      const { error: addressError } = await (supabase as any)
        .from(customerAddressesTable)
        .insert(
          addresses.map((address) => ({
            customer_id: customerId,
            type: address.type,
            line1: address.line1,
            line2: address.line2 ?? null,
            suburb: address.suburb ?? null,
            city: address.city ?? null,
            postcode: address.postcode ?? null,
            country: address.country ?? null,
            is_primary: address.isPrimary,
          }))
        );
      if (addressError) throw addressError;
    }

    imported += 1;
  }

  return { imported };
}
