import { useEffect, useState } from "react";
import axios from "axios";

export default function Stationery() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/stationery")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Stationery Store</h2>

      {/* CATEGORY BUTTONS */}
      <div style={{ marginBottom: 20 }}>
        {categories.map(cat => (
          <button
            key={cat.category}
            onClick={() => setSelected(cat)}
            style={{ margin: 5 }}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* ITEMS DISPLAY */}
      {selected && (
        <div>
          <h3>{selected.category}</h3>
          {selected.items.map(item => (
            <p key={item}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}