interface BiMap<K, V> extends Map<K, V> {
  inverse(): BiMap<V, K>;
}

export default BiMap;