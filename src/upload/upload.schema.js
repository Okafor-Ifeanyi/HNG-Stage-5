import joi from 'joi'

// Joi Validation schema used to verify req data
const uploadSchema = joi.object().keys({
    video: joi.string().required(),
    description: joi.string()
});

export{ uploadSchema } 