interface BiMap<K, V> extends Map<K, V> {
  set(key: K, value: V): this;
  putAll(map: Map<K, V>);
  values(): IterableIterator<V>;
  inverse(): BiMap<V, K>;
}

export default BiMap;