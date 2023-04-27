const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo} = require('../models/modules');
const ApiError = require('../error/ApiError');
const e = require("express");

class DeviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            let media = req.files.img;
            let fileName = `${uuid.v4()}.${media.name.toString().split(".")[1]}`
            media.mv(`./media/${fileName}`, (err) => {
                if (err) {
                    return res.json({success: false})
                }
            });

            const device = await Device.create({name, price, brandId, typeId, img: fileName});
            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id,
                    });
                });
            }

            return res.status(201).json({message: "success", data: device});
        } catch (e) {
            return res.status(500).json({message: e.message, type: "catch"})
            // return next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res) {
        let devices;
        let { brandId, typeId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 15;
        let offset = page * limit - limit;

        if (!brandId && !typeId ) {
            devices = await Device.findAndCountAll({offset, limit});
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, offset, limit});
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, offset, limit});
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId, brandId}, offset, limit});
        }
        return res.json(devices);
    }
    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: "info" }]
        });

        return res.json(device);
    }
}

module.exports = new DeviceController();