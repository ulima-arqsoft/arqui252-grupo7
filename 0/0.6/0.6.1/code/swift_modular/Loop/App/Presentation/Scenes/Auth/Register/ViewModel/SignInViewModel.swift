//
//  RegisterViewModel.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import SwiftUI

@MainActor
class SignInViewModel: ObservableObject {
    var nonce: String = ""
    let router: Router?
    let useCases: UseCases
    
    init(
        router: Router?,
        useCases: UseCases
    ) {
        self.router = router
        self.useCases = useCases
    }
    
    
    @Published var name: String = ""
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var isPasswordhidden: Bool = true
    
    @Published var isLoading: Bool = false
    
}
