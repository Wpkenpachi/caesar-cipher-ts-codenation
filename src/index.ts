import fs from "fs";
import { CaesarCipher } from "./caesar-cipher";
import sha1 from "sha1";
import axios from "axios";
import FormData from "form-data";
// const FormData = require("form-data");
import * as dotenv from "dotenv-safe";
dotenv.config();

const cipher = CaesarCipher();

axios.get(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${process.env.TOKEN}`).then( async ({ data }) => {
    const { token, numero_casas, cifrado } = data;
	const decifrado = cipher.decrypt(cifrado, {config: {defaultNotAllowedExcpetions: true, leapValue: numero_casas}}).decrypted;
    const {data: score} = await sendFileBackToServer({
		token,
		numero_casas,
		cifrado,
		decifrado,
		resumo_criptografico: sha1(decifrado)
	});
	console.log(score);
}).catch(( { response } ) => { console.log(response); });


async function sendFileBackToServer (payload: any) {
	const answer = new FormData();
	const filepath = `${__dirname}/../generated/answer.json`;
	const file = await fs.promises.writeFile(filepath, JSON.stringify(payload), 'utf8');
  	answer.append("answer", fs.createReadStream(filepath));

	const response = await axios.post(
		`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${process.env.TOKEN}`,
		answer,
		{
			headers: {
				"Content-Type": `multipart/form-data; boundary=${answer.getBoundary()}`
			}
		}
	);

	return response;
}