import { Box, Image, Text } from "@skynexui/components";
import { useRouter } from "next/router";
import appConfig from "../../config.json";

export function MessageList(props) {
    const routes = useRouter();
    var messages = props.mensagens;

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {messages.map((mensagem) => {
                return (
                    <Text
                        onClick={(e) => {
                            const index = e.target.getAttribute('data-key')
                            //const index = e.target
                            console.log('clicou: ', index);

                            //index.style.display = 'none'
                            function deleteMsg(value) {
                                return props.mensagens.filter((el) => {
                                    return el.id != value
                                })
                            }

                            messages = deleteMsg(index);
                            console.log(messages)
                        }}
                        key={mensagem.id}
                        data-key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            position: 'relative',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.from}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {mensagem.created_at.substring(0, 10).split('-').reverse().join('/')}
                            </Text>
                        </Box>
                        {/* Declarativo */}
                        {mensagem.text.startsWith(':sticker:') ? (
                            <Image
                                src={mensagem.text.substring(9, mensagem.text.lenght)}
                                styleSheet={{
                                    height: '20vh'
                                }}
                            />
                        ) : (
                            mensagem.text
                        )}

                        {/* Botão Fechar */}
                        {/* <Button
                            styleSheet={{
                                position: 'absolute',
                                right: '0',
                                top: '0'
                            }}
                            variant='primary'
                            colorVariant='neutral'
                            label='X'
                        // onClick={(e) => {
                        //     var x = e.mensagem.id
                        //     alert('clicou: ', x);

                        // }}
                        /> */}
                    </Text>
                );
            })}
        </Box>
    )
}