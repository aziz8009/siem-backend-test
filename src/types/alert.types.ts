export interface ElasticsearchAlert {
    timestamp: string;
    src_ip: string;
    network_target_ip: string;
    signature_name: string;
    severity: number;
}

export interface AlertResponse {
    timestamp: string;
    source_ip: string;
    target_ip: string;
    alert_name: string;
    severity: number;
}

export interface AggregatedAlert {
    target_ip: string;
    total_attacks: number;
    asset_name?: string;
    department?: string;
}

export interface AlertFilterParams {
    department?: string;
    risk?: string;
    page: number;
    limit: number;
}

export interface AlertQueryResponse {
    total: number;
    hits: ElasticsearchAlert[];
}
