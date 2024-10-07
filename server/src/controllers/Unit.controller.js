const Unit = require("../models/unit.model");

const createUnit = async ( req, res) => {
    try {
        const units = await Unit.create(req.body);
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnits = async( req, res) => {
    try {
        const units = await Unit.find({});
        res.status(200).json({units});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUnit = async(req, res) => {
    try {
        const { id } = req.params;
        
        const unit = await Unit.findByIdAndUpdate(id , req.body);

        if(!unit) 
            return res.status(404).json({message: "Unit not found"});

        const updateUnit = await Unit.findById(id);

        res.status(200).json(updateUnit);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUnit = async (req, res) => {
    try {
       const { id } = req.params;
       
       const unit = await Unit.findByIdAndDelete(id);

       if(!unit)
            return res.status(404).json({message: "Unit not found"});

       res.status(200).json({ message: "Unit delete succesful!"});
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createUnit,
    getUnits,
    updateUnit,
    deleteUnit,
}