import { Question } from "@/src/types";

export const QUESTIONS_V1: Record<string, Question> = {
	"1": {
		pergunta_pt: "Informações de contato do responsável:",
		pergunta_en: "Parent/Guardian Contact Information:",
		tipo: "grupo",
		opcoes: [
			{ pt: "Nome(s)", en: "Name(s)" },
			{ pt: "Relação com a criança", en: "Relation to child" },
			{ pt: "Telefone", en: "Phone" },
			{ pt: "Endereço", en: "Address" },
			{ pt: "Email", en: "Email" },
		],
	},
	"2": {
		pergunta_pt: "Informações de contato de quem fala inglês:",
		pergunta_en: "English speaker informer’s Contact Information:",
		tipo: "grupo",
		opcoes: [
			{ pt: "Nome(s)", en: "Name(s)" },
			{ pt: "Relação com a criança", en: "Relation to child" },
			{ pt: "Telefone", en: "Phone" },
			{ pt: "Endereço", en: "Address" },
			{ pt: "Email", en: "Email" },
		],
	},
	"3": {
		pergunta_pt: "Contexto familiar:",
		pergunta_en: "Family Background:",
		tipo: "multipla_escolha",
		opcoes: [
			{
				pt: "Refugiado (especifique nacionalidade)",
				en: "Refugee (specify nationality)",
			},
			{ pt: "Malawiano", en: "Malawian" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"4": {
		pergunta_pt: "Idioma principal falado em casa:",
		pergunta_en: "Primary Language Spoken at Home:",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Kiswahili", en: "Kiswahili" },
			{ pt: "Kirundi", en: "Kirundi" },
			{ pt: "Kinyarwanda", en: "Kinyarwanda" },
			{ pt: "Chichewa", en: "Chichewa" },
			{ pt: "Francês", en: "French" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"5": {
		pergunta_pt:
			"A criança tem alguma condição diagnosticada (informada no Health Passport)?",
		pergunta_en:
			"Does the child have a diagnosed condition (stated in the Health Passport)?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"6": {
		pergunta_pt: "Se sim, especifique a(s) condição(ões):",
		pergunta_en: "If yes, specify the condition(s):",
		tipo: "texto",
	},
	"7": {
		pergunta_pt: "Descrição fornecida pelo Health Passport:",
		pergunta_en: "Description provided by the Health Passport:",
		tipo: "texto",
	},
	"8": {
		pergunta_pt: "Sintomas observados pelo responsável:",
		pergunta_en:
			"No specific/official condition(s), but observed symptoms by the guardian:",
		tipo: "texto",
	},
	"9": {
		pergunta_pt: "A criança toma medicamentos regularmente?",
		pergunta_en: "Does the child take medication regularly?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"10": {
		pergunta_pt: "Se sim, liste os medicamentos:",
		pergunta_en: "List the name or description of medication(s):",
		tipo: "texto",
	},
	"11": {
		pergunta_pt: "Quem é responsável por fornecer a prescrição repetitiva?",
		pergunta_en:
			"Who is responsible for providing the child with the repetitive prescription?",
		tipo: "multipla_escolha",
		opcoes: [
			{
				pt: "Centro de Saúde em Dzaleka",
				en: "Health Centre in Dzaleka",
			},
			{
				pt: "Outra organização de saúde no Malawi",
				en: "Other Health Organization in Malawi",
			},
			{
				pt: "Família ou parentes compram o remédio",
				en: "Family or relatives buy the medicine",
			},
			{
				pt: "Profissionais de saúde voluntários internacionais através da Fraternity Without Borders",
				en: "International Health Volunteer Professionals through Fraternity Without Borders",
			},
			{ pt: "Outro", en: "Others" },
		],
	},
	"12": {
		pergunta_pt: "A criança possui alergias?",
		pergunta_en: "Does the child have any allergies?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Não", en: "No" },
			{ pt: "Alimentar", en: "Food" },
			{ pt: "Medicamentos", en: "Medication" },
			{ pt: "Ambiental", en: "Environmental" },
		],
	},
	"13": {
		pergunta_pt: "Especifique:",
		pergunta_en: "Specify:",
		tipo: "texto",
	},
	"14": {
		pergunta_pt: "A criança utiliza algum equipamento especial?",
		pergunta_en: "Does the child use any special equipment?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Não", en: "No" },
			{ pt: "Cadeira de rodas", en: "Wheelchair" },
			{ pt: "Aparelho auditivo", en: "Hearing aids" },
			{ pt: "Sonda de alimentação", en: "Feeding tube" },
			{ pt: "Adaptações em casa", en: "Adaptations at home" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"15": {
		pergunta_pt: "A criança segue alguma dieta especial?",
		pergunta_en: "Does the child follow a special diet?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Não", en: "No" },
			{ pt: "Vegetariana", en: "Vegetarian" },
			{ pt: "Sem glúten", en: "Gluten-free" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"16": {
		pergunta_pt: "Período pré-natal:",
		pergunta_en: "Prenatal Period:",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Gravidez normal", en: "Normal pregnancy" },
			{ pt: "Complicações", en: "Complications" },
			{ pt: "Exposição a substâncias", en: "Exposure to substances" },
			{ pt: "Ambiente de alto estresse", en: "High-stress environment" },
			{ pt: "Cuidados pré-natais", en: "Prenatal care" },
		],
	},
	"17": {
		pergunta_pt: "Informações de nascimento:",
		pergunta_en: "Birth Information:",
		tipo: "grupo",
		opcoes: [
			{
				pt: "Duração da gravidez: a termo, prematuro, pós-termo",
				en: "Duration of pregnancy: Full-term, Preterm, Post-term",
			},
			{
				pt: "Local de nascimento: casa, hospital, centro de saúde",
				en: "Place of birth: Home birth, Hospital Birth, Health Centre Birth",
			},
			{
				pt: "Tipo de parto: vaginal, cesariana",
				en: "Type of delivery: Vaginal, Cesarean",
			},
			{
				pt: "Peso ao nascer: normal, baixo, alto",
				en: "Birth weight: Normal, Low, High",
			},
		],
	},
	"18": {
		pergunta_pt: "Complicações no nascimento:",
		pergunta_en: "Complications at birth:",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"19": {
		pergunta_pt: "Período neonatal:",
		pergunta_en: "Neonatal period:",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Normal", en: "Normal" },
			{ pt: "Necessitou UTI neonatal", en: "Required NICU care" },
			{ pt: "Dificuldades de alimentação", en: "Feeding difficulties" },
			{ pt: "Problemas respiratórios", en: "Respiratory issues" },
			{ pt: "Outras preocupações de saúde", en: "Other health concerns" },
		],
	},
	"20": {
		pergunta_pt: "Como a criança reage a novos ambientes?",
		pergunta_en: "How does the child react to new environments?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Calma", en: "Calm" },
			{ pt: "Ansiosa", en: "Anxious" },
			{ pt: "Animada", en: "Excited" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"21": {
		pergunta_pt: "A criança apresenta desafios comportamentais?",
		pergunta_en: "Does the child experience behavioral challenges?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Não", en: "No" },
			{ pt: "Birras", en: "Tantrums or meltdowns" },
			{ pt: "Agressão", en: "Aggression" },
			{ pt: "Isolamento", en: "Withdrawal" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"22": {
		pergunta_pt: "A criança prefere:",
		pergunta_en: "Does the child prefer:",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Atividades em grupo", en: "Group activities" },
			{ pt: "Interação individual", en: "One-on-one interaction" },
			{ pt: "Brincadeira solitária", en: "Solitary play" },
		],
	},
	"23": {
		pergunta_pt: "O que ajuda a acalmar a criança?",
		pergunta_en: "What helps calm the child during distress?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Espaço silencioso", en: "Quiet space" },
			{ pt: "Brinquedo favorito", en: "Favorite toy" },
			{ pt: "Conforto físico", en: "Physical comfort" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"24": {
		pergunta_pt: "A criança é independente para comer e beber?",
		pergunta_en: "Is the child independent in eating and drinking?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"25": {
		pergunta_pt: "A criança precisa de ajuda para ir ao banheiro?",
		pergunta_en: "Does the child require assistance with toileting?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"26": {
		pergunta_pt: "A criança possui rotina de sono consistente?",
		pergunta_en: "Does the child have a consistent sleep routine?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"27": {
		pergunta_pt: "A criança tira soneca durante o dia?",
		pergunta_en: "Does the child nap during the day?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"28": {
		pergunta_pt: "Como a criança se comunica?",
		pergunta_en: "How does the child communicate?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Verbal", en: "Verbal" },
			{ pt: "Não-verbal", en: "Non-verbal" },
			{ pt: "Língua de sinais Malawiana", en: "Malawian sign language" },
			{
				pt: "Usa dispositivo de comunicação",
				en: "Uses a communication device",
			},
		],
	},
	"29": {
		pergunta_pt: "A criança possui sensibilidades sensoriais?",
		pergunta_en: "Does the child have sensory sensitivities?",
		tipo: "checkbox",
		opcoes: [
			{ pt: "Não", en: "No" },
			{ pt: "Luzes fortes", en: "Bright lights" },
			{ pt: "Sons altos", en: "Loud noises" },
			{ pt: "Texturas", en: "Textures" },
			{ pt: "Outro", en: "Other" },
		],
	},
	"30": {
		pergunta_pt: "Qual a melhor forma de dar instruções à criança?",
		pergunta_en: "What is the best way to give instructions to the child?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Frases curtas", en: "Short sentences" },
			{ pt: "Recursos visuais", en: "Visual aids" },
			{ pt: "Demonstração", en: "Demonstration" },
		],
	},
	"31": {
		pergunta_pt: "A criança já se afastou ou fugiu alguma vez?",
		pergunta_en:
			"Does the child have a history of wandering or running away?",
		tipo: "multipla_escolha",
		opcoes: [
			{ pt: "Sim", en: "Yes" },
			{ pt: "Não", en: "No" },
		],
	},
	"32": {
		pergunta_pt: "A criança apresenta convulsões ou emergências médicas?",
		pergunta_en:
			"Does the child experience seizures or other medical emergencies?",
		tipo: "multipla_escolha",
		opcoes: [
			{
				pt: "Sim - descrever protocolo",
				en: "Yes - describe the emergency protocol",
			},
			{ pt: "Não", en: "No" },
		],
	},
	"33": {
		pergunta_pt: "Objetivos e recomendações do cuidador:",
		pergunta_en: "Caregiver Feedback and Recommendations:",
		tipo: "grupo",
		opcoes: [
			{
				pt: "Objetivo principal para a criança em cuidados de alívio",
				en: "Primary goal for the child in respite care",
			},
			{ pt: "Atividades a evitar", en: "Activities to avoid" },
			{
				pt: "Atualizações desejadas",
				en: "Updates about child’s activities",
			},
			{
				pt: "Resposta da criança durante a sessão",
				en: "How did the child respond during the session",
			},
			{
				pt: "Incidentes a relatar",
				en: "Were there any incidents to report",
			},
			{
				pt: "Recomendações para sessões futuras",
				en: "Recommendations for future sessions",
			},
		],
	},
};

export default QUESTIONS_V1;
