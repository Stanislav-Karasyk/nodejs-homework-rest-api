const Contact = require("../services/schemas/contact");

const listContacts = async (userId) => {
  const data = await Contact.find({ owner: userId });
  return data;
};

const getContactById = async (userId, contactId) => {
  const data = await Contact.findOne({
    owner: userId,
    _id: contactId,
  });
  return data;
};

const addContact = async (body) => {
  const data = Contact.create(body);
  return data;
};

const updateContact = async (userId, contactId, body) => {
  const data = await Contact.findByIdAndUpdate(
    { owner: userId, _id: contactId },
    { ...body },
    { new: true }
  );
  return data;
};

const removeContact = async (userId, contactId) => {
  const data = await Contact.findByIdAndRemove({
    owner: userId,
    _id: contactId,
  });
  return data;
};

const updateStatusContact = async (userId, contactId, body) => {
  const data = await Contact.findByIdAndUpdate(
    { owner: userId, _id: contactId },
    { ...body },
    { new: true }
  );
  return data;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
