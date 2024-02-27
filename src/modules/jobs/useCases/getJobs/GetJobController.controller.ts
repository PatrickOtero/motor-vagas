import { Request, Response } from "express";
import { GetJobUseCase } from "./GetJobUseCase.useCase";
import { container } from "tsyringe";

export class GetJobController {
    async handle(req: Request, res: Response): Promise<Response> {
        const {locations, keyword, description} = req.body;

        const getJobUseCase = container.resolve(GetJobUseCase);

        try {
            const result = await getJobUseCase.execute(locations, keyword, description);

            // Verifica se o resultado tem as propriedades esperadas antes de acessá-las
            if (result && typeof result.status === 'number' && typeof result.message === 'string') {
                return res.status(result.status).json({ message: result.message });
            } else {
                // Se o resultado não é o esperado, retorne um código de erro genérico e uma mensagem
                return res.status(500).json({ message: "An unexpected error occurred" });
            }
        } catch (error) {
            // Captura erros inesperados e retorna uma resposta de erro
            console.error(error); // Loga o erro para diagnóstico
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
