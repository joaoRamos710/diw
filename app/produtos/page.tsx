'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Card from '@/app/components/ProdutosCard/Card';
import { PostResponse, Produto } from '@/app/models/interfaces';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Produtos() {
    const { data, error, isLoading } = useSWR<Produto[]>('/api/products', fetcher);

    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<Produto[]>([]);
    const [cart, setCart] = useState<Produto[]>([]);
    const [estudante, setEstudante] = useState(false);
    const [cupao, setCupao] = useState('');
    const [nome, setNome] = useState('');
    const [morada, setMorada] = useState('');
    const [nomeError, setNomeError] = useState<string | null>(null);
    const [moradaError, setMoradaError] = useState<string | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);
    const [postResponse, setPostResponse] = useState<PostResponse | null>(null);
    const [totalCusto, setTotalCusto] = useState<number>(0);
    const [custoFinal, setCustoFinal] = useState<number | null>(null);
    const [descontoAplicado, setDescontoAplicado] = useState<number | null>(null);

    useEffect(() => {
        if (data) {
            const filtered = data.filter((produto) =>
                produto.title.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [data, search]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const total = cart.reduce((total, produto) => total + produto.price, 0);
        setTotalCusto(total);
        setCustoFinal(null); // Reset custo final ao alterar carrinho
        setDescontoAplicado(null); // Reset desconto ao alterar carrinho
        setCartError(null); // Remove erro do carrinho ao adicionar itens
    }, [cart]);

    const addToCart = (produto: Produto) => {
        setCart((prevCart) => {
            if (prevCart.some((item) => item.id === produto.id)) {
                return prevCart; // Evita duplicados no carrinho
            }
            return [...prevCart, produto];
        });
    };

    const removeFromCart = (produtoId: number) => {
        setCart((prevCart) => prevCart.filter((produto) => produto.id !== produtoId));
    };

    // Função para aplicar o cupão
    const applyCoupon = () => {
        const desconto = estudante ? totalCusto * 0.1 : 0; // Aplica 10% para estudantes
        setDescontoAplicado(desconto);
        setCustoFinal(totalCusto - desconto); // Atualiza o custo final
    };

    // Função para validar os campos obrigatórios
    const validateFields = () => {
        let isValid = true;
        if (!nome.trim()) {
            setNomeError('Campo obrigatório');
            isValid = false;
        } else {
            setNomeError(null);
        }
        if (!morada.trim()) {
            setMoradaError('Campo obrigatório');
            isValid = false;
        } else {
            setMoradaError(null);
        }
        if (cart.length === 0) {
            setCartError('O carrinho está vazio. Adicione produtos antes de comprar.');
            isValid = false;
        } else {
            setCartError(null);
        }
        return isValid;
    };

    // Função para realizar a compra
    const buy = () => {
        if (!validateFields()) return; // Valida os campos antes de prosseguir

        fetch('/api/deisishop/buy', {
            method: 'POST',
            body: JSON.stringify({
                products: cart.map((produto) => produto.id),
                name: nome,
                address: morada,
                student: estudante,
                coupon: cupao,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setCart([]);
                setPostResponse(data);
                setCustoFinal(Number(data.totalCost));
                setDescontoAplicado(totalCusto - Number(data.totalCost));
                setNome('');
                setMorada('');
                setCupao('');
                setEstudante(false);
            })
            .catch(() => {
                setPostResponse({ error: 'Erro ao realizar a compra. Tente novamente.' });;
            });
    };

    if (error) return <div>Erro ao carregar produtos.</div>;
    if (isLoading) return <div>Carregando...</div>;
    if (!data || data.length === 0) return <div>Nenhum produto encontrado.</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Produtos</h1>

            {/* Campo de Pesquisa */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded"
                />
            </div>

            {/* Produtos Filtrados */}
            {filteredData.length === 0 && search ? (
                <div className="text-center text-gray-500">Nenhum produto encontrado para {'"'}{search}{'"'}.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredData.map((produto) => (
                        <Card key={produto.id} produto={produto} onAddToCart={addToCart} />
                    ))}
                </div>
            )}

            {/* Carrinho */}
            <div className="mt-6">
                <h2 className="text-xl font-bold text-center">Carrinho</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-600 text-center">O carrinho está vazio.</p>
                ) : (
                    <>
                        <ul className="mt-4">
                            {cart.map((produto, index) => (
                                <li key={index} className="flex items-center justify-between border-b py-2">
                                    <Image
                                        src={produto.image}
                                        alt={produto.title}
                                        width={50}
                                        height={50}
                                        className="rounded"
                                    />
                                    <div className="flex-1 ml-4">
                                        <span className="block text-gray-700">{produto.title}</span>
                                        <span className="text-blue-600 font-bold">{produto.price.toFixed(2)}€</span>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(produto.id)}
                                        className="text-red-500 hover:text-red-700 ml-4">
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 text-right">
                            <p className="text-lg font-bold text-gray-700">
                                Custo Total (sem desconto): €{totalCusto.toFixed(2)}
                            </p>
                            {descontoAplicado !== null && (
                                <p className="text-lg font-bold text-red-700">
                                    Desconto Aplicado: €{descontoAplicado.toFixed(2)}
                                </p>
                            )}
                            {custoFinal !== null && (
                                <p className="text-lg font-bold text-green-700">
                                    Custo Final (com desconto): €{custoFinal.toFixed(2)}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Seção de Compra */}
            <section id="menu-compra" className="mt-6">
                <div className="flex items-center mb-4">
                    <p>Nome:</p>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className={`ml-2 p-1 border ${
                            nomeError ? 'border-red-500' : 'border-gray-400'
                        } rounded`}
                        placeholder="Digite seu nome"
                    />
                    {nomeError && <span className="ml-2 text-red-500">{nomeError}</span>}
                </div>
                <div className="flex items-center mb-4">
                    <p>Morada:</p>
                    <input
                        type="text"
                        value={morada}
                        onChange={(e) => setMorada(e.target.value)}
                        className={`ml-2 p-1 border ${
                            moradaError ? 'border-red-500' : 'border-gray-400'
                        } rounded`}
                        placeholder="Digite sua morada"
                    />
                    {moradaError && <span className="ml-2 text-red-500">{moradaError}</span>}
                </div>
                {cartError && <p className="text-red-500 font-bold">{cartError}</p>}
                <p className="mt-4">
                    És estudante do DEISI?
                    <input
                        type="checkbox"
                        name="estudante_deisi"
                        value="sim"
                        checked={estudante}
                        onChange={(e) => setEstudante(e.target.checked)}
                        className="ml-2"
                    />
                </p>
                <p className="mt-4">
                    Cupão de desconto:
                    <input
                        type="text"
                        id="cupao"
                        value={cupao}
                        onChange={(e) => setCupao(e.target.value)}
                        className="ml-2 p-1 border border-gray-400 rounded"
                    />
                </p>
                <button
                    onClick={applyCoupon}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    Aplicar Cupão
                </button>
                <button
                    id="botao-comprar"
                    onClick={buy}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
                    Comprar
                </button>
                {postResponse && (
                    <div className="mt-4">
                        <p className="text-lg font-bold text-gray-700">{postResponse.message}</p>
                        <p className="text-gray-700">{postResponse.address}</p>
                        <p className="text-gray-700">Referência: {postResponse.reference}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
