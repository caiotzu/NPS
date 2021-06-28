import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

    // http://localhost:3333/answers/10?u=91b19d50-9f2b-4394-8776-6c78c082d711
    /**
     * Route Params => Parametros que compõem a rota
     * routes.get("/answers/:value")
     * 
     * Query Params => Busca, Paginação, não obrigatório
     * ? chave=valor
     */
    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser) {
            throw new AppError("Survey User does not exists!");
        }

        surveyUser.value = Number(value); 

        await surveysUsersRepository.save(surveyUser);

        return  res.json(surveyUser);
    }
}

export { AnswerController }