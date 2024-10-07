const Status = require('../models/status.model');

const createStatus = async(req, res) => {
    try {
        const allStatus = await Status.create(req.body);
        res.status(200).json(allStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllStatus = async(req, res) => {
    try {
        const allStatus = await Status.find({});
        res.status(200).json({allStatus});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStatusById = async(req, res) => {
    try {
        const { id } = req.params;
        const allStatus = await Status.findById(id);

        if(!allStatus) {
            return res.status(404).json({
                success: false,
                message: "STATUS_NOT_FOUND",
                error: "status not found",
            })
        }
        res.status(200).json(allStatus);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "SEARCH_STATUS_FAILED",
            error: error.message
        })
    }
};

const updateStatus = async(req, res) => {
    try {
        const { id } = req.params;

        const allStatus = await Status.findByIdAndUpdate( id, req.body, {
            new : true,
        }) ;

        if(!allStatus) {
            return res.status(404).json({ message: "Status not found"});
        }

        const updateStatus = await Status.findById(id);

        res.status(200).json(updateStatus);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStatus = async(req, res) => {
    try {
        const { id } = req.params;

        const allStatus = await Status.findByIdAndDelete(id);

        if(!allStatus) {
            return res.status(404).json({ message: "Status not found"});
        };

        res.status(200).json({ message: "Status deleted sucessful"});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports ={
    createStatus,
    getAllStatus,
    getStatusById,
    updateStatus,
    deleteStatus
}