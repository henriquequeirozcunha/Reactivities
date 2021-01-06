using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;

        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if(user == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found"});

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName ==
            _userAccessor.GetCurrentUserName());

            var profile =  new Profile 
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Image = user.Photos.SingleOrDefault(x => x.IsMain)?.Url,
                    Photos = user.Photos,
                    Bio = user.Bio,
                    FollowersCount =  user.Followers.Count(),
                    FollowingCount = user.Following.Count()
                };

            if(currentUser.Following.Any(x => x.TargetId == user.Id))
              profile.IsFollowed = true;
            
            return profile;
        }
    }
}