
using Microsoft.EntityFrameworkCore;
using ModernizationChallenge.Entities;
using ModernizationChallenge.Models;
using MyTask = ModernizationChallenge.Entities.Task;

namespace ModernizationChallenge.Services
{
    public interface ITaskService
    {
        Task<List<TaskModel>> GetAsync();
        Task<TaskModel> InsertAsync(TaskModel model);
        Task<TaskModel> UpdateAsync(TaskModel model);
        Task<bool> DeleteAsync(int id);
        Task<bool> CompleteTaskAsync(int id);
    }

    public class TaskService : ITaskService
    {
        private readonly ModernizationChallengeDbContext _context;
        public TaskService(ModernizationChallengeDbContext context)
        {
            _context = context;
        }
        public async Task<bool> CompleteTaskAsync(int id)
        {
            var task = await GetTaskByIdAsync(id);
            if (task == null) return false;

            task.Completed = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await GetTaskByIdAsync(id);
            if (task == null) return false;

            task.DateDeleted = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TaskModel>> GetAsync()
        {
            return await _context.Tasks.Where(e => e.DateDeleted == null).Select(e => new TaskModel()
            {
                Completed = e.Completed,
                Details = e.Details,
                Id = e.Id
            }).ToListAsync();
        }

        public async Task<TaskModel> InsertAsync(TaskModel model)
        {
            if (model == null) return null;

            var now = DateTime.Now;
            var task = new MyTask()
            {
                Details = model.Details,
                Completed = false,
                DateCreated = now,
                DateModified = now
            };

            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
            return Task2TaskModel(task);
        }

        public async Task<TaskModel> UpdateAsync(TaskModel model)
        {
            if (model == null) return null;
            var task = await GetTaskByIdAsync(model.Id);
            if (task == null) return null;

            task.Details = model.Details;
            task.DateModified = DateTime.Now;
            task.Completed = model.Completed;

            await _context.SaveChangesAsync();
            return Task2TaskModel(task);
        }

        private TaskModel Task2TaskModel(MyTask task)
        {
            return new TaskModel()
            {
                Completed = task.Completed,
                Details = task.Details,
                Id = task.Id
            };
        }

        private async Task<MyTask?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}
