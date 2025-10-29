import {gettaskbyid} from "./apicalls.tsx";
import {useState} from "react";


interface SearchbytaskProps {
    query: string;
    onSearchResults?: (results: any[]) => void;
}
const searchbytask = ({ query: initialQuery = "", onSearchResults }: SearchbytaskProps) => {
    const [query, setQuery] = useState(initialQuery);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setSearching(true);
        try {
            const results = await gettaskbyid(query);
            console.log(`Searching tasks with query: ${query}`);
            if (onSearchResults) onSearchResults(results);

        } catch (error) {
            console.error(`Failed to search tasks with query ${query}:`, error);
        }
        finally {
            setSearching(false);
        }
    };
    return (
        <div>
            <h2>Search Tasks</h2>
            <form onSubmit={handleSearch}>
                <label>
                    Query:
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}/>
                </label>
                <br/>
                <button type="submit" disabled={searching}>
                    {searching ? "Searching..." : "Search"}
                </button>
            </form>
        </div>
    );
}
export default searchbytask;