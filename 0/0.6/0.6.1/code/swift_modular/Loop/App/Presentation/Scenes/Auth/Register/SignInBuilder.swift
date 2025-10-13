//
//  SignInBuilder.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import SwiftUI

@MainActor
struct SignInBuilder {

    static func build() -> some View {
        SignInViewContainer()
    }
    
    private static func innerBuilder(
        router: Router?,
        authContainer: AuthContainer
    ) -> SignInView {
        SignInView(
            viewModel: buildViewModel(
                router: router,
                signInWithGoogleUseCase: authContainer.buildSignInWithGoogleUseCase()
            )
        )
    }
    
    private static func buildViewModel(
        router: Router?,
        signInWithGoogleUseCase: SignInWithGoogleUseCase
    ) -> SignInViewModel {
        SignInViewModel(
            router: router,
            useCases: .init(
                signInWithGoogleUseCase: signInWithGoogleUseCase
            )
        )
    }

    private struct SignInViewContainer: View {
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
