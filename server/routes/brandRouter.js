const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware")

router.post('/', roleMiddleware("ADMIN"), brandController.create);
router.get('/', authMiddleware, brandController.getAll);

module.exports = router;