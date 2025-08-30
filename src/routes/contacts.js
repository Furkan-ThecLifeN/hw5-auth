import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactsController.js";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactSchema.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.use(authenticate); // Tüm kontak rotalarına kimlik doğrulama middleware'ini ekle

router.get("/", ctrlWrapper(getAllContacts));
router.get("/:id", isValidId, ctrlWrapper(getContactById));
router.post(
  "/",
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);
router.patch(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);
router.delete("/:id", isValidId, ctrlWrapper(deleteContact));

export default router;