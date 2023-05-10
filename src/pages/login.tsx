import React, { useEffect } from 'react'
import { Card } from 'components/Card'
import { Heading } from 'components/Heading'
import { FormProvider, useForm } from 'react-hook-form'
import { Input } from 'components/Input'
import { Button } from 'components/Button'
import { Text } from 'components/Text'
import { Logo } from 'components/Logo'

import { Configuration, OpenAIApi } from "openai";
import { htmlToText } from 'html-to-text';
import { IconSpinner } from 'components/icons/components/IconSpinner'


const authenToken = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE2ODM2OTg5NDMsImV4cCI6MTY4NjMyODY4NiwiaXNzIjoiaHR0cDovL2lkZW50aXR5LXNlcnZpY2UiLCJjbGllbnRfaWQiOiJiY2EuY2xpZW50Iiwic3ViIjoiNTA3ZDdiYzgtY2FlMS00MWQ2LTk0MTAtMjU1ZTFlNDYxMTNlIiwiYXV0aF90aW1lIjoxNjgzNjk4OTQzLCJpZHAiOiJsb2NhbCIsImZlYXR1cmVzIjpbIlVTRVItVklFVyIsIklORk9STUFUSU9OLVZJRVciLCJJTkZPUk1BVElPTi1TWVNURU1fSU5GT1JNQVRJT04tVklFVyIsIklORk9STUFUSU9OLVBST0RVQ1RfSU5GT1JNQVRJT04tVklFVyIsIklORk9STUFUSU9OLUJVU0lORVNTX1BPTElDWS1WSUVXIiwiSU5GT1JNQVRJT04tUFJPTU9USU9OU19QT0xJQ1ktVklFVyIsIkNSTS1WSUVXIiwiQ1JNLURBVEFfTElTVC1WSUVXIiwiQ1JNLUNBTExCQUNLLVZJRVciLCJDUk0tQ1VTVE9NRVItVklFVyIsIlBST01PVElPTlNfUk9PVC1WSUVXIiwiUFJPTU9USU9OU19ST09ULVBST01PVElPTlMtVklFVyIsIlNBTEVTLVZJRVciLCJTQUxFUy1PUkRFUi1WSUVXIiwiU0FMRVMtT1JERVJfQllfU1RBVFVTLVZJRVciLCJIRUxQREVTSy1WSUVXIiwiSEVMUERFU0stVElDS0VUUy1WSUVXIiwiUFJPRFVDVC1WSUVXIiwiUFJPRFVDVC1QUk9EVUNUX0xJU1QtVklFVyIsIkNPTU1JU1NJT05fUk9PVC1WSUVXIiwiQ09NTUlTU0lPTl9ST09ULUNPTU1JU1NJT04tVklFVyIsIkRBVEFfQ0VOVEVSLVZJRVciLCJEQVRBX0NFTlRFUi1QTEFOTklOR19QQUNLQUdFLVZJRVciLCJEQVRBX0NFTlRFUi1ISVNUT1JZLVZJRVciLCJEQVRBX0NFTlRFUi1QQUNLQUdFX01BUktFVElORy1WSUVXIl0sImlkIjoiNTA3ZDdiYzgtY2FlMS00MWQ2LTk0MTAtMjU1ZTFlNDYxMTNlIiwiYWN0IjoiYWdlbnQiLCJhY2NvdW50X3R5cGUiOiJTdGFuZGFyZEFnZW50IiwicGFyZW50X2lkIjoiMWExNmJkMTAtZDRkMS00YjNjLWFmYmMtN2MzZGQ1ZTNkOTkzIiwiYWdlbnRfdGl0bGUiOiJDb2FjaDIiLCJyb2xlIjpbIlN0YW5kYXJkQWdlbnQiXSwidXNlcm5hbWUiOiJuZ29jc2FuZ2JjYSIsIm5hbWUiOiJMw6ogVGjhu4sgTmfhu41jIFNhbmciLCJwaG9uZV9udW1iZXIiOiIzMzcyOTE5NzIiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.f5sR9GeUSvTidEXD6A9NnnjHCIq1YBaqIpd-AyLkPPflJ6h2xX5yiXiswzHiIRNQ0fVJPwsdFj5-yYGsVZjr_aRE0_8QjoJZ8Z2fk-rHFKDnGvfhjx1LNNKZOUuGsOI6dY2zKdZlhJ8iBuH8peDVHPEIsVVYMTh3ZZ1Hcy0cLsWeQ4DO9KnI8VPTiFDznD9MQfuaC5BRen0u1L-oRdDjhyfK6wzpKoET85n0f2nYjZc3_rTwOb0OBYODWwA4yvO5jETS-mdX-VixIylbenQTbAi1w8LtgmHZIvwOE1SU_NwNQmyjuEw39Lw6yu72pJ79qwWmS0ghw4d-2CoSxAsRRw'

type Message = {
    value?: string;
    type?: string;
    user?: string;
};

const extractArray = (inputStr: string): string[] => {
    // Match an outer array of strings (including nested arrays)
    const regex = /(\[(?:\s*"(?:[^"\\]|\\.)*"\s*,?)+\s*\])/;
    const match = inputStr.match(regex);

    if (match && match[0]) {
        try {
            // Parse the matched string to get the array
            return JSON.parse(match[0]) as string[];
        } catch (error) {
            console.error("Error parsing the matched array:", error);
        }
    }

    console.warn("Error, could not extract array from inputString:", inputStr);
    return [];
};


const LoginPage = () => {
    const configuration = new Configuration({
        apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);

    const [productDescription, setProductDescription] = React.useState('')
    const [question, setQuestion] = React.useState('')
    const [product, setProduct] = React.useState('')
    const [productId, setProductId] = React.useState('293f9fca-b5e5-41b6-beb3-738b139ee751')
    const [answer, setAnswer] = React.useState('')
    const [messages, setMessages]: Message[] = React.useState([])
    const [isLoading, setLoading] = React.useState(false)
    const [productSummary, setProductSummary] = React.useState('')



    const createSuggestions = async () => {
        console.log("create suggestion")
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Bạn là người bán sản phẩm có miêu tả như sau '${productDescription}'. 3 câu hỏi thường hỏi thường gặp nhất về sản phẩm của bạn là gì. trả về câu trả lời theo dạng mảng  string có thể sử dụng JSON.parse()`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        console.log(JSON.stringify(completion.data.choices[0].text));
        let content = completion.data.choices[0].text
        content = content?.trim().replace("\n", "").replace("\\", "")
        console.log("content", content)
        let questions = extractArray(content)
        let counter = 0;

        setMessages([])
        let suggestedQuestions = []
        questions.forEach(element => {
            console.log("suggest ", element)
            counter++
            const newMessages = { value: counter + ". " + element, type: 'question', user: 'bot' };
            suggestedQuestions.push(newMessages);
        });

        setMessages([...messages, ...suggestedQuestions]);
    }

    const fetchProduct = async (url: string) => {
        setLoading(true)
        await fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Origin": "https://biz.droppii.vn",
                "Authorization": authenToken
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

        }).then(response => {
            if (response.ok) {
                return response.json(); // parses JSON response into native JavaScript objects
            }
            throw response
        }).then(data => {
            // console.log("data", data)
            let productDetail = data
            if (productDetail && productDetail?.data) {
                const content = productDetail?.data?.content
                const text = htmlToText(content, {
                    wordwrap: 130
                });
                setProductDescription(text)
                setMessages([])
            }
        }).catch(error => {
            console.log("error", error)
        }).finally(() => {
            setLoading(false)
        });

    }

    const handleAsk = async (question: string) => {
        if (!question) {
            return
        }
        handleAddMessage(question, 'answer', 'customer')
        setLoading(true)
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Bạn là người bán sản phẩm có miêu tả như sau '${productDescription}'. Bạn cần trả lời câu hỏi của khách hàng là '${question}'.`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        handleAddMessage(completion.data.choices[0].text, 'answer', 'bot')
        setQuestion('')
        setLoading(false)
    }

    const handleSummaryAsk = async () => {
        setLoading(true)
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Bạn là người bán sản phẩm có miêu tả như sau '${productDescription}'. Bạn viết một đoạn quảng cáo về sản phẩm này để kích tích người mua khoảng 4 câu.`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        setProductSummary(completion.data.choices[0].text)
        setLoading(false)
    }

    const handleAddMessage = (message: string, type: string, user: string) => {
        const newMessages = [...messages, { value: message, type, user }];
        setMessages(newMessages);
    }
    const updateProduct = async () => {
        await fetchProduct(`https://api.droppii.com/product-service/v1/app/products/${productId}/type/0/cart/detail`)
        handleSummaryAsk()
        createSuggestions()
    }
    useEffect(() => {
        updateProduct()
    }, [productId])


    const listItems = messages.map(message => {
        if (message.type === 'question') {
            return (
                <div>
                    <Button className="mt-2"
                        onClick={() => {
                            // setQuestion(message.value)
                            handleAsk(message.value)
                        }}>
                        {message.value}
                    </Button>
                </div>)
        }
        if (message.user === 'bot') {
            return (<Card className="w-full max-w-[560px] mt-6 bg-blue-300 align-left"><li>{message.value}</li></Card>)
        }
        return (<Card className="w-full max-w-[560px] mt-6 bg-green-300 align-right"><li>{message.value}</li></Card>)
    }
    );

    return (
        <div className="w-full min-h-screen flex-col flex justify-center items-center space-y-8 bg-gray-100 pt-8 pb-28">
            <div className="text-center flex flex-col items-center">
                <div className="mb-6 transform scale-125">
                    <Logo />
                </div>
                <div className="space-y-1">
                    <Heading as="h3">Chatbot</Heading>
                </div>
            </div>
            <Card className="w-full max-w-[800px] !p-10">
                <FormProvider >
                    <div>
                        {'Product ID:'}
                        <Input
                            label="Product"
                            placeholder="Product ID"
                            name="password"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            rules={{ required: 'Required' }}
                        />
                    </div>

                    <div style={{ maxHeight: 150, overflow: 'auto' }}>
                        <Text>{productSummary}</Text>
                    </div>
                    <div className="mt-4 mb-4">
                        <Heading as="h3">Conversation</Heading>
                    </div>
                    <div style={{ maxHeight: 300, overflow: 'auto', marginBottom: 10 }}>
                        <ul>{listItems}</ul>
                        {isLoading &&
                            <span className="inset-0 flex items-center justify-center">
                                <IconSpinner />
                            </span>
                        }
                    </div>

                    <form className="space-y-6 mt-9" onSubmit={handleAsk}>
                        <Input
                            fullWidth
                            label="Question"
                            placeholder="Question"
                            name="password"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            rules={{ required: 'Required' }}
                        />

                        <Button appearance="primary" type="button" fullWidth
                            onClick={() => {
                                handleAsk(question)
                            }}>
                            Send
                        </Button>
                    </form>
                </FormProvider>
            </Card>
        </div>
    )
}

export default LoginPage
