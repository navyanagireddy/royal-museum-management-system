class MuseumController {
    constructor(museumModel) {
        this.museumModel = museumModel;
    }

    async getAllMuseums(req, res) {
        try {
            const museums = await this.museumModel.findAll();
            res.status(200).json(museums);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving museums', error });
        }
    }

    async getMuseumById(req, res) {
        const { id } = req.params;
        try {
            const museum = await this.museumModel.findById(id);
            if (museum) {
                res.status(200).json(museum);
            } else {
                res.status(404).json({ message: 'Museum not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving museum', error });
        }
    }
}

export default MuseumController;