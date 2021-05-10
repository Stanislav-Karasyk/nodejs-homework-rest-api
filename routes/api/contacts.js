const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("../../validation/validation");

router
  .get("/", contactsController.listContacts)
  .post("/", validateCreateContact, contactsController.addContact);

router
  .get("/:contactId", contactsController.getContactById)
  .delete("/:contactId", contactsController.removeContact)
  .patch(
    "/:contactId",
    validateUpdateContact,
    contactsController.updateContact
  );

router.patch(
  "/:contactId/favorite",
  validateUpdateStatusContact,
  contactsController.updateStatusContact
);
module.exports = router;
