const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  const { name, email, mobile, subject, message } = req.body;

  if (!name?.trim() || !mobile?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Name, mobile, subject, and message are required' });
  }

  const inquiry = await Inquiry.create({
    name: name.trim(),
    email: email?.trim(),
    mobile: mobile.trim(),
    subject: subject.trim(),
    message: message.trim(),
  });

  return res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
};

exports.getInquiries = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
  return res.json({ inquiries, count: inquiries.length });
};

exports.getInquiryById = async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  return res.json({ inquiry });
};

exports.updateInquiry = async (req, res) => {
  const { status, adminNotes } = req.body;
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status, adminNotes },
    { new: true, runValidators: true }
  );
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  return res.json({ message: 'Inquiry updated', inquiry });
};

exports.deleteInquiry = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  return res.json({ message: 'Inquiry deleted' });
};

exports.getInquiryStats = async (req, res) => {
  const [total, newCount, readCount, repliedCount] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
    Inquiry.countDocuments({ status: 'read' }),
    Inquiry.countDocuments({ status: 'replied' }),
  ]);
  return res.json({ total, new: newCount, read: readCount, replied: repliedCount });
};
