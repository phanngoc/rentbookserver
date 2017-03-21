import multer from 'multer';
import path from 'path';

var upload = multer({ dest: path.join(__dirname, '../public/uploads') });

export default upload;
