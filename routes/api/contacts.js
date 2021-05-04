const express = require("express");
const router = express.Router();

const contactsController = require("../../model/index");
const {
  validateCreateContact,
  validateUpdateContact,
} = require("../../validation/validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsController.listContacts();
    return res.json({
      status: "Success",
      code: 200,
      message: "Contact list found",
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactsController.getContactById(
      req.params.contactId
    );
    if (contact) {
      return res.json({
        status: "Success",
        code: 200,
        message: "Contact found",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", validateCreateContact, async (req, res, next) => {
  try {
    const contact = await contactsController.addContact(req.body);
    return res.status(201).json({
      status: "Success",
      code: 201,
      message: "Contact successfully created",
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactsController.removeContact(
      req.params.contactId
    );
    if (contact) {
      return res.json({
        status: "Success",
        code: 200,
        message: "Contact deleted",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.patch("/:contactId", validateUpdateContact, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Bad request",
      });
    }
    const contact = await contactsController.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.json({
        status: "Success",
        code: 200,
        message: "Contact updated successfully",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
