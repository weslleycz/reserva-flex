export const emailCreateUser = (name: string, email: string) => {
  return `
        <h1>Bem-vindo! Sua conta foi criada com sucesso</h1>
    
        <p>Prezado [Nome do usuário],</p>
    
        <p>É com grande prazer que informamos que sua conta foi criada com sucesso em nosso sistema. Damos as boas-vindas à nossa plataforma e estamos empolgados em tê-lo como nosso novo usuário.</p>
    
        <p>Aqui estão os detalhes da sua conta:</p>
    
        <ul>
            <li><strong>Nome de usuário:</strong> ${name}</li>
            <li><strong>Endereço de e-mail:</strong> ${email}</li>
        </ul>
    
        <p>A partir de agora, você terá acesso a todos os recursos e funcionalidades disponíveis em nosso sistema.</p>
    
        <p>Gostaríamos de lembrá-lo da importância de manter suas informações de login em segurança. Por favor, não compartilhe suas credenciais com terceiros e evite o uso de senhas fáceis de adivinhar. Caso tenha alguma dúvida ou precise de suporte, nossa equipe de atendimento ao cliente está pronta para ajudá-lo.</p>
    
        <p>Estamos ansiosos para fornecer a você uma ótima experiência em nossa plataforma. Sinta-se à vontade para explorar e aproveitar todos os recursos disponíveis.</p>
    
        <p>Mais uma vez, bem-vindo! Seja parte da nossa comunidade e aproveite ao máximo o nosso serviço.</p>
    `;
};
