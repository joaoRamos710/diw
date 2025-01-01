export async function GET() {
    try {
        const response = await fetch('https://deisishop.pythonanywhere.com/products');
        if (!response.ok) {
            throw new Error('Falha ao procurar os produtos.');
        }
        const produtos = await response.json();
        return new Response(JSON.stringify(produtos), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar os produtos.' }), { status: 500 });
    }
}
