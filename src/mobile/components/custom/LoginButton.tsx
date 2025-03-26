import { Button, ButtonText, IButtonTextProps } from '@/components/ui/button';
import { IButtonProps } from '@gluestack-ui/button/lib/types';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export interface LoginButtonProps {
    auth_endpoint: string;
    token_endpoint: string;
    client_id: string;
    redirect_uri: string;
    scopes: string[];
    buttonProps?: IButtonProps;
    buttonTextProps?: IButtonTextProps;
    setToken?: (token: string) => void;
}

WebBrowser.maybeCompleteAuthSession();

export default function LoginButton({ auth_endpoint, token_endpoint, client_id, redirect_uri, scopes, buttonProps, buttonTextProps, setToken }: LoginButtonProps) {

    const discovery = {
        authorizationEndpoint: auth_endpoint,
        tokenEndpoint: token_endpoint,
    };
    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: client_id,
            redirectUri: redirect_uri,
            scopes: scopes,
        },
        discovery
    );

    const login = () => {
        promptAsync().then(
            (codeResponse) => {
                if (request && codeResponse?.type === 'success' && discovery) {
                    console.log(codeResponse);
                    AuthSession.exchangeCodeAsync(
                        {
                            clientId: client_id,
                            code: codeResponse.params.code,
                            extraParams: request.codeVerifier
                                ? { code_verifier: request.codeVerifier }
                                : undefined,
                            redirectUri: redirect_uri,
                        },
                        discovery,
                    ).then((res) => {
                        console.log(res.accessToken);
                        setToken && setToken(res.accessToken);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
    }

    return (
        <Button onPress={login} {...buttonProps}>
            <ButtonText {...buttonTextProps}>Login</ButtonText>
        </Button>
    );
}