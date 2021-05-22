const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("../../validation/validation");

const guard = require('../../services/guard');

router
  .get("/", guard, contactsController.listContacts)
  .post("/", guard, validateCreateContact, contactsController.addContact);

router
  .get("/:contactId", guard, contactsController.getContactById)
  .delete("/:contactId", guard, contactsController.removeContact)
  .patch(
    "/:contactId",
    guard,
    validateUpdateContact,
    contactsController.updateContact
  );

router.patch(
  "/:contactId/favorite",
  guard,
  validateUpdateStatusContact,
  contactsController.updateStatusContact
);
module.exports = router;
