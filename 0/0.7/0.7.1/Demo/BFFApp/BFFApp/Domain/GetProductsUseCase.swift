//
//  GetProductsUseCase.swift
//  BFFApp
//
//  Created by Kohji Onaja on 2/11/25.
//

import Foundation

class GetProductsUseCase {
    private let httpClient: HTTPClient
    
    init(httpClient: HTTPClient) {
        self.httpClient = httpClient
    }
    
    func execute(page: Int? = 1) async throws -> ProductsResponse {
        let response: ProductsResponse? = try await httpClient.fetch(
            endpoint: .init(
                queryParameters: [
                    .init(name: "page", value: "\(page ?? 1)")
                ],
                method: .get,
                function: .products
            )
        )
        guard let response else {
            throw HTTPClientError.responseError
        }
        return response
    }
}
