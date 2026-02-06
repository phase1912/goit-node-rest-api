import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
    const contacts = await contactsService.listContacts();
    return res.json(contacts);
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
        throw HttpError(404, "Not found");
    }
    return res.json(contact);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);
    if (!contact) {
        throw HttpError(404, "Not found");
    }
    return res.json(contact);
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    const contact = await contactsService.addContact(name, email, phone);
    return res.status(201).json(contact);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const contact = await contactsService.updateContact(id, req.body);
    if (!contact) {
        throw HttpError(404, "Not found");
    }
    return res.status(200).json(contact);
};
