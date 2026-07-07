# fRAGvision: Fragrance Recommender


## Indexes
CREATE INDEX btree_brand_name_idx ON public.perfume_vectors USING btree (brand, name)
CREATE INDEX trgm_brand_name_idx ON public.perfume_vectors USING gin ((((COALESCE(brand, ''::text) || ' '::text) || COALESCE(name, ''::text))) gin_trgm_ops)
