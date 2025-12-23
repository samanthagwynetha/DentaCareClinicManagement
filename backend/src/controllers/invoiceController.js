import Invoice from '../models/Invoice.js';

//create invoice
export const createInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
};

// read all
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate("patient")
            .populate("appointment");
        res.json(invoices);    
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};

// read one 
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate("patient")
            .populate("appointment");
        
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found"});
        } 
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// update
export const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate (
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(invoice);
    } catch (error) {
        res.status(404).json({ message: error.message});
    }
};

// delete
export const deleteInvoice = async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ message: "Invoice deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};