const Contact = require("../models/contact.schem");

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const addContact = async (name, email, phone) => {
  const contact = await Contact.create({
    name: name,
    email: email,
    phone: phone,
  });
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
};

const updateContact = async (contactId, update) => {
  const contact = await Contact.findByIdAndUpdate(contactId, update, {
    new: true,
  });
  return contact;
};

const updateFav = async (contactId, favorite) => {
  const contact = await Contact.findByIdAndUpdate(contactId, favorite, {
    new: true,
  });
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFav,
};
