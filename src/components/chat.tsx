import { FormEvent, useEffect, useRef, useState } from 'react';
import { useChat } from 'privategpt-sdk-web/react';
import { Badge } from '@/components/ui/badge';
import { PrivategptApi } from 'privategpt-sdk-web';
import { PrivategptClient } from '@/lib/pgpt';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import { useLocalStorage } from 'usehooks-ts';
import { InputArea } from './ui/InputArea';
import { ChatNavbar } from './ui/Navbar';
import { DefaultCard } from './ui/DefaultCard';

const MODES = [
  {
    value: 'query',
    title: 'Query docs',
    description:
      'Uses the context from the ingested documents to answer the questions',
  },
  {
    value: 'search',
    title: 'Search files',
    description: 'Fast search that returns the 4 most related text chunks',
  },
  {
    value: 'chat',
    title: 'LLM Chat',
    description: 'No context from files',
  },
] as const;

export function Chat() {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [mode] = useLocalStorage<(typeof MODES)[number]['value']>(
    'pgpt-chat-mode',
    'chat',
  );
  const [environment] = useLocalStorage('pgpt-url', '');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useLocalStorage<
    Array<
      PrivategptApi.OpenAiMessage & {
        sources?: PrivategptApi.Chunk[];
      }
    >
  >('messages', []);


  const { completion } = useChat({
    client: PrivategptClient.getInstance(environment),
    messages: messages.map(({ sources: _, ...rest }) => rest),
    onFinish: ({ completion: c, sources: s }) => {
      addMessage({ role: 'assistant', content: c, sources: s });
      setTimeout(() => {
        messageRef.current?.focus();
      }, 100);
    },
    // useContext: mode === 'query',
    // enabled: ['query', 'chat'].includes(mode),
    // includeSources: mode === 'query',
    // systemPrompt,
    // contextFilter: {
    //   docsIds: ['query', 'search'].includes(mode)
    //     ? selectedFiles.reduce((acc, fileName) => {
    //         const groupedDocs = files?.filter((f) => f.fileName === fileName);
    //         if (!groupedDocs) return acc;
    //         const docIds = [] as string[];
    //         groupedDocs.forEach((d) => {
    //           docIds.push(...d.docs.map((d) => d.docId));
    //         });
    //         acc.push(...docIds);
    //         return acc;
    //       }, [] as string[])
    //     : [],
    // },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input) return;
    const content = input.trim();
    addMessage({ role: 'user', content });
    if (mode === 'search') {
      searchDocs(content);
    }
  };

  const addMessage = (
    message: PrivategptApi.OpenAiMessage & {
      sources?: PrivategptApi.Chunk[];
    },
  ) => {
    setMessages((prev) => [...prev, message]);
    setInput('');
  };

  const searchDocs = async (input: string) => {
    const chunks = await PrivategptClient.getInstance(
      environment,
    ).contextChunks.chunksRetrieval({ text: input });
    const content = chunks.data.reduce((acc, chunk, index) => {
      return `${acc}**${index + 1}.${chunk.document.docMetadata?.file_name}${
        chunk.document.docMetadata?.page_label
          ? ` (page ${chunk.document.docMetadata?.page_label})** `
          : '**'
      }\n\n ${chunk.document.docMetadata?.original_text} \n\n  `;
    }, '');
    addMessage({ role: 'assistant', content });
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [completion]);

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 justify-between flex h-[57px] items-center gap-1 bg-background px-4">
          <ChatNavbar />
        </header>
        <main className="flex flex-col gap-4 p-4 h-full">
        {!messages || messages.length === 0 && <div className='flex justify-center items-center mt-[126px]'><DefaultCard /></div>}
          <div className="flex-col flex h-full space-y-4 rounded-xl p-4 w-full">
            <Badge
              variant="outline"
              className="absolute right-3 top-3"
            >
              Output
            </Badge>
            <div className="flex-1">
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-fit p-3 grid gap-2 shadow-lg rounded-xl w-fit',
                      {
                        'self-start': message.role === 'user',
                        'self-end bg-gradient-to-t from-[#003] to-[#003] text-white w-full':
                          message.role === 'assistant',
                      },
                    )}
                  >
                    <Badge variant="outline" className="w-fit bg-muted/100">
                      {message.role}
                    </Badge>
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(message.content || ''),
                      }}
                    />
                    {message.sources && message.sources?.length > 0 && (
                      <div>
                        <p className="font-bold">Sources:</p>
                        {message.sources.map((source) => (
                          <p key={source.document.docId}>
                            <strong>
                              {source.document.docMetadata?.file_name as string}
                            </strong>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {completion && (
                  <div className="h-fit p-3 grid gap-2 shadow-lg rounded-xl w-full self-end bg-violet-200">
                    <Badge variant="outline" className="w-fit bg-muted/100">
                      assistant
                    </Badge>
                    <div
                      className="text-sm prose marker:text-black"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(completion),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full h-[80.55555px] py-[13.889px] px-[27.778px] flex-col items-center left-0 bottom-0 sticky">
                    <InputArea input={input} setInputValue={setInput} handleSubmit={handleSubmit} />
                    <div className="text-gray-500 text-[13px]">Civic.ai can make mistakes.Cross-check important info</div>
                </div>
                </main>
      </div>
    </div>
  );
}
