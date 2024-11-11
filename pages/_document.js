import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Chatbot configuration script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.embeddedChatbotConfig = {
                chatbotId: "Ss0S_4ShD_JbnP6RMew2B",
                domain: "www.chatbase.co"
              };
            `,
          }}
        />
        {/* Chatbot embed script */}
        <script
          src="https://www.chatbase.co/embed.min.js"
          chatbotId="Ss0S_4ShD_JbnP6RMew2B"
          domain="www.chatbase.co"
          defer
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
