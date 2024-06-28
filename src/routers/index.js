import authRouter from './auth.js';
import productRouter from './product.js';
import brandRouter from './brand.js';
import categoryRouter from './category.js'
const initRouter = (app)=>{
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/brand', brandRouter);
    app.use('/api/v1/category', categoryRouter);
}
export default initRouter;