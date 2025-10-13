//
//  UserCardView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

struct UserCardView: View {
    let userDetails: ProfileViewModel.DisplayedUser
    
    var body: some View {
        VStack(alignment: .leading, spacing: 20){
            HStack {
                Text(userDetails.profilePicLetter.uppercased())
                    .font(.system(size: 30, weight: .heavy))
                    .foregroundColor(.black)
                    .padding(20)
                    .background {
                        Circle()
                            .fill(Color.white)
                    }
                VStack(alignment: .leading, spacing: 10){
                    Text(userDetails.name)
                        .font(.system(size: 25, weight: .semibold))
                        .foregroundColor(.white)
                    Text(verbatim: userDetails.email)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                }
                Spacer()
            }
            .frame(maxWidth: .infinity)
            Text("Miembro desde \(Date().formatted())")
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color.black.gradient)
        .cornerRadius(10)
        .shadow(radius: 1)
    }
}
