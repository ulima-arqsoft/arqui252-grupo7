//
//  LoginBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import SwiftUI

@MainActor
struct LoginBuilder {

    static func build() -> some View {
        LoginViewContainer()
    }
    
    private static func innerBuilder(
        router: Router?,
        authContainer: AuthContainer
    ) -> LoginView {
        LoginView(
            viewModel: buildViewModel(
                router: router,
                loginUseCase: authContainer.buildLoginUseCase()
            )
        )
    }
    
    private static func buildViewModel(
        router: Router?,
        loginUseCase: LoginUseCase
    ) -> LoginViewModel {
        LoginViewModel(
            router: router,
            useCases: .init(
                loginUseCase: loginUseCase
            )
        )
    }

    private struct LoginViewContainer: View {
        @DependencyContainer(\.authContainer) var authContainer
        @Environment(\.router) var router
        
        var body: some View {
            innerBuilder(
                router: router,
                authContainer: authContainer()
            )
        }
    }
}
