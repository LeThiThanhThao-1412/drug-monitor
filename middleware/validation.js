// File: middleware/validation.js
const validateDrugInput = (req, res, next) => {
    const { name, dosage, card, pack, perDay } = req.body;
    const errors = [];

    // a. Kiểm tra tên có độ dài hơn 5 ký tự
    if (!name || name.length <= 5) {
        errors.push("Name must be longer than 5 characters");
    }

    // b. Kiểm tra định dạng dosage: XX-morning,XX-afternoon,XX-night (X là số)
    const dosageRegex = /^\d+-morning,\d+-afternoon,\d+-night$/;
    if (!dosage || !dosageRegex.test(dosage)) {
        errors.push("Dosage must follow the format: XX-morning,XX-afternoon,XX-night (where X is digit)");
    }

    // c. Kiểm tra card phải lớn hơn 1000
    if (!card || parseInt(card) <= 1000) {
        errors.push("Card must be more than 1000");
    }

    // d. Kiểm tra pack phải lớn hơn 0
    if (!pack || parseInt(pack) <= 0) {
        errors.push("Pack must be more than 0");
    }

    // e. Kiểm tra perDay phải lớn hơn 0 và nhỏ hơn 90
    if (!perDay || parseInt(perDay) <= 0 || parseInt(perDay) >= 90) {
        errors.push("PerDay must be more than 0 and less than 90");
    }

    // Nếu có lỗi, trả về response lỗi
    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors
        });
    }

    // Nếu không có lỗi, chuyển đến middleware/controller tiếp theo
    next();
};

module.exports = {
    validateDrugInput
};