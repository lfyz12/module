const { Files } = require("../models/models")
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ApiError = require("../ApiError/ApiError");
class FileController {
    async create(req, res, next) {
        try {
            // Проверяем наличие файлов в запросе
            if (!req.files || Object.keys(req.files).length === 0) {
                return next(ApiError.badRequest('No files uploaded'));
            }
    
            // Обрабатываем каждый файл
            const uploadedFiles = [];
            for (const key in req.files) {
                const file = req.files[key];
    
                // Проверяем размер файла
                if (file.size > 2 * 1024 * 1024) {
                    return next(ApiError.badRequest('File size exceeds the limit of 2MB'));
                }
    
                // Генерируем уникальный идентификатор для файла
                const fileId = uuidv4();
    
                // Формируем новое имя файла
                let fileName = file.name;
                const fileExtension = path.extname(fileName);
                const baseName = path.basename(fileName, fileExtension);
                let i = 1;
                while (await Files.findOne({ where: { name: fileName } })) {
                    fileName = `${baseName} (${i})${fileExtension}`;
                    i++;
                }
    
                // Перемещаем файл в статическую директорию
                await file.mv(path.resolve(__dirname, '..', 'uploads', fileName));
    
                // Создаем запись о файле в базе данных
                const createdFile = await Files.create({ file_id: fileId, name: fileName, user_id: req.body.user_id });
                uploadedFiles.push(createdFile);
            }
    
            // Отправляем успешный ответ с информацией о созданных файлах
            return res.json(uploadedFiles);
        } catch (error) {
            // Передаем ошибку в обработчик ошибок
            next(ApiError.internalServerError(error.message));
        }
    }

    async deleteFile(req, res, next) {
        try {
            // Получаем идентификатор файла из параметров запроса
            const fileId = req.params.fileId;
    
            // Находим файл в базе данных
            const file = await Files.findOne({ where: { file_id: fileId } });
    
            // Проверяем, найден ли файл
            if (!file) {
                return next(ApiError.notFound('File not found'));
            }
    
            // Удаляем файл из статической директории
            const filePath = path.resolve(__dirname, '..', 'uploads', file.name);
            fs.unlinkSync(filePath);
    
            // Удаляем запись о файле из базы данных
            await file.destroy();
    
            // Возвращаем успешный ответ
            return res.json({ success: true, message: 'File deleted successfully' });
        } catch (error) {
            // Передаем ошибку в обработчик ошибок
            next(ApiError.internalServerError(error.message));
        }
    }
    
}