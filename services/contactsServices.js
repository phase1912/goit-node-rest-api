import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json');

async function listContacts() {
  return readFile();
}

async function getContactById(contactId) {
  const contacts = await readFile();
  return contacts.find(contact => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await readFile();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [removedContact] = contacts.splice(index, 1);
  await writeFile(contacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readFile();
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await writeFile(contacts);
  return newContact;
}

async function updateContact(contactId, data) {
  const contacts = await readFile();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...data };
  await writeFile(contacts);
  return contacts[index];
}

async function readFile() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error.message);
    return [];
  }
}

async function writeFile(data) {
  const dbDir = path.dirname(contactsPath);
  try {
    await fs.mkdir(dbDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error.message);
  }
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
}

export default { listContacts, getContactById, removeContact, addContact, updateContact };