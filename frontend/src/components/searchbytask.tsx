import {gettaskbyid} from "./apicalls.tsx";


interface SearchbytaskProps {
    query: string;
    onSearchResults?: (results: any[]) => void;
}
const searchbytask = ({ query, onSearchResults }: SearchbytaskProps) => {

    const handleSearch = async () => {
        try {
            const results = await gettaskbyid(query);
            console.log(`Searching tasks with query: ${query}`);
            if (onSearchResults) {
                onSearchResults(results);
            }
        } catch (error) {
            console.error(`Failed to search tasks with query ${query}:`, error);
        }
    };
    return (
        <div>
            <h2>Search Tasks</h2>
            <form onSubmit={handleSearch}>
                <label>
                    Query:
                    <input type="text" defaultValue={query}/>
                </label>
                <br/>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
export default searchbytask;