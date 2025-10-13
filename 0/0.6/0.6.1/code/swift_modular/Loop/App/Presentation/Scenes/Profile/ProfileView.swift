//
//  ProfileView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

struct ProfileView: View {
    
    @ObservedObject var viewModel: ProfileViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 30) {
                UserCardView(userDetails: viewModel.displayedUser)
                LastOrders()
                Favorites()
            }
            .padding(.horizontal)
        }
        .onAppear(perform: viewModel.doFetchUser)
        .navigationTitle("Perfil")
    }
}

#Preview {
    ProfileViewBuilder.build()
}
