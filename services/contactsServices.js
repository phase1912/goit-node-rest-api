import Contact from '../db/models/contact.js';

const listContacts = () => Contact.findAll();

const getContactById = (contactId) => Contact.findByPk(contactId);

const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);

  if (!contact) {
    return null;
  }
  
  await contact.destroy();

  return contact;
}

const addContact = (contact) => Contact.create(contact);

const updateContact = async (contactId, data) => {
  const contact = await getContactById(contactId);

  if (!contact) {
    return null;
  }

  await contact.update(data);
  return contact;
}

const updateStatusContact = async (contactId, body) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  await contact.update({ favorite: body.favorite });
  return contact;
};

export default { listContacts, getContactById, removeContact, addContact, updateContact, updateStatusContact };