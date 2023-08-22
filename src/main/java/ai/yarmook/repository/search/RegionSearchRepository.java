package ai.yarmook.repository.search;

import static org.springframework.data.elasticsearch.client.elc.QueryBuilders.queryStringQuery;

import ai.yarmook.domain.Region;
import ai.yarmook.repository.RegionRepository;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data Elasticsearch repository for the {@link Region} entity.
 */
public interface RegionSearchRepository extends ElasticsearchRepository<Region, Long>, RegionSearchRepositoryInternal {}

interface RegionSearchRepositoryInternal {
    Stream<Region> search(String query);

    Stream<Region> search(Query query);

    @Async
    void index(Region entity);

    @Async
    void deleteFromIndexById(Long id);
}

class RegionSearchRepositoryInternalImpl implements RegionSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final RegionRepository repository;

    RegionSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, RegionRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Region> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<Region> search(Query query) {
        return elasticsearchTemplate.search(query, Region.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Region entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Region.class);
    }
}
