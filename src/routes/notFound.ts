import { Router, Response, Request } from 'express';

const routeNotFound = (req: Request, res: Response) => {
  res.status(404).send('Запрос не найден');
};

const router = Router();

router.get('/', routeNotFound);
router.post('/', routeNotFound);
router.put('/', routeNotFound);
router.delete('/', routeNotFound);
router.patch('/', routeNotFound);

export default router;
