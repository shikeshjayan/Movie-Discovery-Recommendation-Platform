import User from "../models/user.model.js";
import Media from "../models/media.model.js";
export const getRecommendations = async (req, res) => {
  try {
    const { type } = req.query; // 'movie', 'tv', or null for both
    const user = await User.findById(req.user._id);

    const allInteractions = [
      ...(user.history || []),
      ...(user.watchLater || []),
    ];

    // Build base query
    let baseQuery = {};
    if (type) baseQuery.mediaType = type; // ✅ filter by movie or tv

    // Fallback for new users
    if (allInteractions.length === 0) {
      const topMedia = await Media.find(baseQuery)
        .sort({ voteAverage: -1 })
        .limit(20);
      return res.status(200).json({ success: true, data: topMedia });
    }

    const excludedTmdbIds = allInteractions.map((item) => item.movieId);

    const interactedMedia = await Media.find({
      tmdbId: { $in: excludedTmdbIds },
    });

    const genreCounts = {};
    interactedMedia.forEach((item) => {
      (item.genres || []).forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const topGenres = Object.keys(genreCounts)
      .sort((a, b) => genreCounts[b] - genreCounts[a])
      .slice(0, 3);

    const recommendations = await Media.find({
      ...baseQuery, // ✅ apply type filter
      genres: { $in: topGenres },
      tmdbId: { $nin: excludedTmdbIds },
    })
      .sort({ voteAverage: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
