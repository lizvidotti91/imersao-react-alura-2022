import { Box, TextField, Button } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';

import { createClient } from '@supabase/supabase-js';
import { Header } from '../src/components/Header';
import { MessageList } from '../src/components/MessageList';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY2OTU3MSwiZXhwIjoxOTU5MjQ1NTcxfQ.xQZKGkkZjrHwl0u_f66QGlnUF6xLmOkBJq5KS8h3Y8I';
const SUPABASE_URL = 'https://gzdolgyubfmflpvnubar.supabase.co';
const supabase_client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function realTimeMsg(newMessage) {
    return supabase_client
        .from('mensagens')
        .on('INSERT', (res) => {
            //alert('Você tem uma nova mensagem');
            newMessage(res.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const [message, setMessage] = React.useState('');
    const [list, setList] = React.useState([
        // {
        //     id: 1,
        //     text: `:sticker:${appConfig.stickers[0]}`,
        //     from: 'lizvidotti91'
        // }
    ]);
    const query = useRouter();
    const name = query.query.name;

    // Tudo que foge do fluxo padrão do meu componente
    // Quando a página carrega, ele é executado
    // o [] significa que o supabase_client só executa quando a página carrega
    React.useEffect(() => {
        // Na minha tabela mensagem, selecionar todos os campos
        supabase_client.from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                //console.log('dados da consulta: ', data);
                setList(data);
            });

        realTimeMsg((msg) => {
            /* 
                * Setar todos os valores que eu já tinha
                * Pega tudo o que já existia na lista de mensagens
                * Mais a nova mensagem
            */
            setList((currentList) => {
                return [
                    msg,
                    ...currentList
                ]
            });
        })
    }, []);

    function newMessage(value) {
        const message = {
            // id: list.length + 1,
            from: name,
            text: value
        }

        // Gravar a nova mensagem no banco de dados do Supabase
        supabase_client.from('mensagens')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS do Supabase
                message
            ])
            .then(({ data }) => {
                console.log('Gravei: ', data);
            });

        setMessage('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[100],
                backgroundImage: `url(https://cdn2.unrealengine.com/tga-guestcostumes-10beanlineup-final-export-3840x2160-efeb0818b672.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={list} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onSubmit={(event) => {
                            event.preventDefault();
                            newMessage(message);
                        }}
                    >
                        {/* Botão para enviar stickers */}
                        {/* 
                        *   Callback
                        *   Chamada de retorno
                        *   Quando algo que quero terminou, ele executa a função que eu passei
                        */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                newMessage(`:sticker:${sticker}`)
                            }}
                        />

                        {/* Input para escrever a mensagem */}
                        <TextField
                            value={message}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setMessage(newValue);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    // Prevenir o comportamento padrão, que é a quebra de linha quando dá enter
                                    e.preventDefault();
                                    newMessage(message);
                                }
                            }}
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />

                        {/* Criando botão de enviar mensagem */}
                        <Button
                            type='submit'
                            label='Enviar'
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[100],
                                mainColorStrong: appConfig.theme.colors.primary[900],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}